/* $RCSfile$
 * $Author: hansonr $
 * $Date: 2008-08-17 01:22:42 +0200 (Sun, 17 Aug 2008) $
 * $Revision: 9744 $
 *
 * Copyright (C) 2002-2005  The Jmol Development Team
 *
 * Contact: jmol-developers@lists.sf.net
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
package org.jmol.modelset;

import javax.vecmath.Point3f;

import org.jmol.util.Point3fi;

public class MeasurementPending extends Measurement {

  private boolean haveTarget = false;
  
  public boolean haveTarget() {
    return haveTarget;
  }
  
  int numSet = 0;
  public int getNumSet() {
    return numSet;
  }

  public MeasurementPending(ModelSet modelSet) {
    super(modelSet, null, null, Float.NaN, (short) 0, null, 0);
  }

  private boolean checkPoint(Point3f ptClicked) {
    for (int i = 1; i <= numSet; i++)
      if (countPlusIndices[i] == -1 - i
          && points[i - 1].distance(ptClicked) < 0.01)
        return false;
    return true;
  }
  
  public int getIndexOf(int atomIndex) {
    for (int i = 1; i <= numSet; i++)
      if (countPlusIndices[i] == atomIndex)
        return i;
    return 0;
  }

  public int addPoint(int atomIndex, Point3f ptClicked, boolean doSet) {
    if (ptClicked == null) {
      if (getIndexOf(atomIndex) > 0) {
        if (doSet)
          numSet = count;
        return count;
      }
      haveTarget = (atomIndex >= 0);
      if (!haveTarget)
        return count = numSet;
      count = numSet + 1;
      countPlusIndices[count] = atomIndex;
    } else {
      if (!checkPoint(ptClicked)) {
        if (doSet)
          numSet = count;
        return count;
      }
      int pt = numSet;
      haveTarget = true;
      count = numSet + 1;
      if (points[pt] == null)
        points[pt] = new Point3fi();
      points[pt].set(ptClicked);
      countPlusIndices[count] = -2 - pt;
    }
    countPlusIndices[0] = count;
    if (doSet)
      numSet = count;
    value = getMeasurement();
    formatMeasurement();
    return count;
  }
}


